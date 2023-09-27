package main

type Payment struct {
	Id      int
	Content string
	Price   int
	Date    string
	PayWay  string
}
type Debt struct {
	Id        int
	Content   string
	Principal int
	Interest  float64
	Attribute string
	Settle    bool
}
type Assets struct {
	Id           int
	Content      string
	Totalvalue   string
	CurrencyType string
	AssetType    string
}
type NetAsset struct {
	Id              int
	Month_NetAssets int
	Month           string
}
