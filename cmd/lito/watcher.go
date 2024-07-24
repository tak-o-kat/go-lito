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

			// **TODO: May need to set a time delay in case the CREATE event isn't instant

			// Wait for the WRITE even trigger before contintuing
			if (e.Op.String() == "WRITE") {
				// After file trigger is set log the event
				la.Logger.Info().Msgf("%s %q", e.Op.String(), e.Name)

				// Begin parsing the archive log file and get the saved data
				nodeData := Parser(la)

				la.Logger.Debug().Msgf("Node Totals: %v", *nodeData.totals)
				for _, round := range *nodeData.proposed {
					la.Logger.Debug().Msgf("Round: %v, Time: %v", round.Round, round.blockTime)
				}


				// Insert all the parsed data into the database
				// Inserter(parsedData)

			}
		}
	}
}