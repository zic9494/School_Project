package main

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type Bill_Return_Data struct {
	TargetId     int
	ReturnType   string
	TotalVolue   string
	CurrencyType string
	AssetsType   string
	Principal    string
	Interest     string
	Attribute    string
	Settle       bool
	Price        string
	Date         time.Time
	Payway       string
	Content      string
	Delete       bool
}

func Create_bill_Return_Model(c *gin.Context) Bill_Return_Data {
	Date, _ := time.Parse(time.RFC3339, c.PostForm("date")+"T15:04:05.000Z")
	Settle, _ := strconv.ParseBool(c.PostForm("settle"))
	delete, _ := strconv.ParseBool(c.PostForm("delete"))
	Target_id, _ := strconv.Atoi(c.PostForm("TargetId"))
	Data := Bill_Return_Data{
		TargetId:     Target_id,
		ReturnType:   c.PostForm("ReturnType"),
		TotalVolue:   c.PostForm("total_volue"),
		CurrencyType: c.PostForm("currencytype"),
		AssetsType:   c.PostForm("assetstype"),
		Principal:    c.PostForm("principal"),
		Interest:     c.PostForm("interest"),
		Attribute:    c.PostForm("attribute"),
		Settle:       Settle,
		Price:        c.PostForm("price"),
		Date:         Date,
		Payway:       c.PostForm("payway"),
		Content:      c.PostForm("content"),
		Delete:       delete,
	}
	return Data
}

func (data Bill_Return_Data) Payment(id int) error {
	Price, _ := strconv.Atoi(data.Price)
	_, err := db.Exec("INSERT INTO `payment`(content, price, date, pay_way, who) VALUES (?, ?, ?, ?, ?)", data.Content, Price*-1, data.Date, data.Payway, id)
	if err != nil {
		return err
	}
	return nil
}

func (data Bill_Return_Data) Income(id int) error {
	Price, _ := strconv.Atoi(data.Price)
	_, err := db.Exec("INSERT INTO `payment`(content, price, date, who) VALUES (?, ?, ?, ?)", data.Content, Price, data.Date, id)
	if err != nil {
		return err
	}
	return nil
}

func (data Bill_Return_Data) Debt(id int) error {
	Interest, _ := strconv.ParseFloat(data.Interest, 32)
	_, err := db.Exec("INSERT INTO `debt`(content, principal, interest, attrIbute, settle, who) VALUES (?, ?, ?, ?, ?, ?)", data.Content, data.Principal, Interest*0.01, data.Attribute, data.Settle, id)
	if err != nil {
		return err
	}
	return nil
}
func (data Bill_Return_Data) Assets(id int) error {
	ret, err := db.Exec("INSERT INTO `assets`(content, total_value, who) VALUES(?, ?, ?)", data.Content, data.TotalVolue, id)
	if err != nil {
		return err
	}
	Now_Id, err := ret.LastInsertId()
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT INTO `assets_detail`(currency_type, asset_type, assets_id) VALUES(?, ?, ?)", data.CurrencyType, data.AssetsType, Now_Id)
	if err != nil {
		return err
	}
	return nil
}

func (Data Bill_Return_Data) NetAsset(id int) error {
	var Num int
	err := db.QueryRow("select sum(price) from payment where date >= ?", Data.Date).Scan(&Num)
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT INTO `netassets`(month_netassets, month, who) VALUES( ?, ?, ?)", Num, Data.Date, id)
	if err != nil {
		return err
	}
	return nil
}
func (Data Bill_Return_Data) Payment_Update() error {
	_, err := db.Exec("UPDATE `payment` set content = ?, price = ?, date = ?, pay_way = ? WHERE id = ?", Data.Content, "-"+Data.Price, Data.Date, Data.Payway, Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}

func (Data Bill_Return_Data) Income_Update() error {
	_, err := db.Exec("UPDATE `payment` set content = ?, price = ?, date = ? WHERE id = ?", Data.Content, Data.Price, Data.Date, Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}

func (Data Bill_Return_Data) Debt_Update() error {
	_, err := db.Exec("UPDATE `debt`  set content = ?, principal = ?, interest = ?, attribute = ?, settle = ? WHERE id = ?", Data.Content, Data.Principal, Data.Interest, Data.Attribute, Data.Settle, Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}

func (Data Bill_Return_Data) Assets_Update() error {
	_, err := db.Exec("UPDATE `assets` set content = ?, total_value = ? WHERE id = ?", Data.Content, Data.TotalVolue, Data.TargetId)
	if err != nil {
		return err
	}
	_, err = db.Exec("UPDATE `assets_detail` set currency_type = ?, asset_type = ? WHERE assets_id = ?", Data.CurrencyType, Data.AssetsType, Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}

func (Data Bill_Return_Data) Payment_Delete() error {
	_, err := db.Exec("DELETE FROM payment WHERE id = ?", Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}
func (Data Bill_Return_Data) Debt_Delete() error {
	_, err := db.Exec("DELETE FROM debt WHERE id = ?", Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}
func (Data Bill_Return_Data) Assets_Delete() error {
	_, err := db.Exec("DELETE FROM assets WHERE id = ?", Data.TargetId)
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM assets_detail WHERE assets_id = ?", Data.TargetId)
	if err != nil {
		return err
	}
	return nil
}
