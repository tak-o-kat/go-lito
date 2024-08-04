package lito

import (
	"go-lito/internal/parser"
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

func (la *LitoApp) Watcher() {
	w, err := fsnotify.NewWatcher()
	if err != nil {
		la.Logger.Fatal().Msgf("creating a new watcher: %s", err)
	}
	defer w.Close()

	// Used for testing os.Getenv("ALGORAND_DATA")	+ "/node.test.log"
	file := la.AlgodInfo.ArchiveFile

	watchType, isSet := os.LookupEnv("WATCH_TYPE")
	if !isSet || watchType == "" {
		watchType = "CREATE"
	}

	la.Logger.Info().Msgf("Watch type: %s", watchType)

	// Start listening for events.
	go la.watcherLoop(w, file, watchType)

	// Make sure what we'ere watching is a file
	st, err := os.Lstat(file) //la.AlgodInfo.archiveFile)
	if err != nil {
		la.Logger.Fatal().Msgf("%s", err)
	}

	if st.IsDir() {
		la.Logger.Fatal().Msgf("%q is a directory, not a file", file)
	}

	// Watch the directory, not the file itself.
	err = w.Add(filepath.Dir(file))
	if err != nil {
		la.Logger.Fatal().Msgf("%q: %s", file, err)
	}

	la.Logger.Info().Msgf("WATCH %q", file)
	<-make(chan struct{}) // Block forever
}

// TODO: Remove file and use la.AlgodInfo.archiveFile
func (la *LitoApp) watcherLoop(w *fsnotify.Watcher, file string, watchType string) {
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
			if file == e.Name {
				found = true
			}
			if !found {
				continue
			}

			// **TODO: May need to set a time delay in case the CREATE event isn't instant

			// Wait for the WRITE even trigger before contintuing
			if e.Op.String() == watchType {
				// After file trigger is set log the event
				la.Logger.Info().Msgf("%s %q", e.Op.String(), e.Name)

				// Begin parsing the archive log file and get the saved data
				nodeData := parser.Parser(la.Logger,
					la.AlgodInfo.ArchiveFile,
					la.AlgodInfo.PartAccount)

				la.Logger.Debug().Msgf("Node Totals: %v", *nodeData.Totals)
				for _, round := range *nodeData.Proposed {
					la.Logger.Debug().Msgf("Round: %v, Time: %v", round.Round, round.BlockTime)
				}

				// Insert all the parsed data into the database
				la.Inserter(nodeData)

			}
		}
	}
}
