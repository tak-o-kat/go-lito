package lito

import (
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

func Watcher(la *LitoApp) {
	w, err := fsnotify.NewWatcher()
	if err != nil {
		la.Logger.Fatal().Msgf("creating a new watcher: %s", err)
	}
	defer w.Close()

	// Start listening for events.
	go watcherLoop(w, la)

	// Make sure what we'ere watching is a file
	st, err := os.Lstat(la.algodInfo.archiveFile)
	if err != nil {
		la.Logger.Fatal().Msgf("%s", err)
	}

	if st.IsDir() {
		la.Logger.Fatal().Msgf("%q is a directory, not a file", la.algodInfo.archiveFile)
	}

	// Watch the directory, not the file itself.
	err = w.Add(filepath.Dir(la.algodInfo.archiveFile))
	if err != nil {
		la.Logger.Fatal().Msgf("%q: %s", la.algodInfo.archiveFile, err)
	}

	la.Logger.Info().Msgf("WATCH %q", la.algodInfo.archiveFile)
	<-make(chan struct{}) // Block forever
}

func watcherLoop(w *fsnotify.Watcher, la *LitoApp) {
	i := 0
	for {
		select {
		// Read from Errors.
		case err, ok := <-w.Errors:
			if !ok { // Channel was closed (i.e. Watcher.Close() was called).
				return
			}
			la.Logger.Error().Msgf("ERROR: %s", err)
		// Read from Events.
		case e, ok := <-w.Events:
			if !ok { // Channel was closed (i.e. Watcher.Close() was called).
				return
			}

			// Ignore files we're not interested in. Can use a
			// map[string]struct{} if you have a lot of files, but for just a
			// few files simply looping over a slice is faster.
			var found bool
			if la.algodInfo.archiveFile == e.Name {
				found = true
			}
			if !found {
				continue
			}

			// Just print the event nicely aligned, and keep track how many
			// events we've seen.
			i++
			

			if (e.Op.String() == "WRITE") {
				la.Logger.Info().Msgf("%d %s %q", i, e.Op.String(), e.Name)
				Parse(la)
			}
		}
	}
}