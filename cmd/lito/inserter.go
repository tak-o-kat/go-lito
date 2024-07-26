package lito

import "go-lito/internal/parser"


func Inserter(la *LitoApp, nodeData *parser.SortedData) {

	la.Logger.Debug().Msg("Inserting: node data")
	la.DB.InsertNodeData(nodeData)

}