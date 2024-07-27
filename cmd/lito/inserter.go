package lito

import "go-lito/internal/parser"


func (la *LitoApp) Inserter(nodeData *parser.SortedData) {

	la.Logger.Debug().Msg("Inserting: node data")
	la.DB.InsertNodeData(nodeData)

}