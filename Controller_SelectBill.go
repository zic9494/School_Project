package main

import (
	"strconv"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Payment_data(c *gin.Context) {
	year, _ := strconv.Atoi(c.Query("year"))
	month, _ := strconv.Atoi(c.Query("month"))
	session := sessions.Default(c)
	name := session.Get("UserInfo").(string)
	User := User{}
	User = User.Get_User_Data(name)
	ID := User.ID()
	Front_Date := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	Behind_Date := time.Date(year, time.Month(month+1), 1, 0, 0, 0, 0, time.UTC)
	rows, _ := db.Query("SELECT id, content, price, date, pay_way FROM `payment` WHERE who = ? AND date >= ?  AND date < ?", ID, Front_Date, Behind_Date)
	defer rows.Close()
	data := Payment{}
	Content := []Payment{}
	for rows.Next() {
		err := rows.Scan(&data.Id, &data.Content, &data.Price, &data.Date, &data.PayWay)
		if err != nil {
			c.JSON(500, gin.H{
				"Error": err,
			})
		} else {
			Content = append(Content, data)
		}
	}
	c.JSON(200, gin.H{
		"Data": Content,
	})
}

func Debt_Data(c *gin.Context) {
	session := sessions.Default(c)
	name := session.Get("UserInfo").(string)
	User := User{}
	User = User.Get_User_Data(name)
	ID := User.ID()
	rows, _ := db.Query("SELECT id, content, principal, interest, attribute, settle FROM `debt` WHERE who = ?", ID)
	data := Debt{}
	Content := []Debt{}
	for rows.Next() {
		err := rows.Scan(&data.Id, &data.Content, &data.Principal, &data.Interest, &data.Attribute, &data.Settle)
		if err != nil {
			c.JSON(500, gin.H{
				"Message": err,
			})
		}
		Content = append(Content, data)
	}
	c.JSON(200, gin.H{
		"Data": Content,
	})
}

func Assets_Data(c *gin.Context) {
	session := sessions.Default(c)
	name := session.Get("UserInfo").(string)
	User := User{}
	User = User.Get_User_Data(name)
	ID := User.ID()
	rows, _ := db.Query("select R.id, R.content, R.total_value, L.currency_type, L.asset_type from `assets` as R inner join `assets_detail` as L on R.id = L.assets_id where who = ?", ID)
	data := Assets{}
	Content := []Assets{}
	for rows.Next() {
		err := rows.Scan(&data.Id, &data.Content, &data.Totalvalue, &data.CurrencyType, &data.AssetType)
		if err != nil {
			c.JSON(500, gin.H{
				"Message": err,
			})
			return
		}
		Content = append(Content, data)
	}
	c.JSON(200, gin.H{
		"Data": Content,
	})
}
func NetAsset_Data(c *gin.Context) {
	year := time.Now().Year()
	month := time.Now().Month()
	session := sessions.Default(c)
	name := session.Get("UserInfo").(string)
	User := User{}
	User = User.Get_User_Data(name)
	ID := User.ID()
	rows, _ := db.Query("SELECT price, date FROM `payment`where who = ? order by date DESC", ID)
	data := Payment{}
	Content := [][]Payment{}
	i := -1
	for rows.Next() {
		err := rows.Scan(&data.Price, &data.Date)

		if err != nil {
			c.JSON(500, gin.H{
				"Message": err,
			})
		}

		DataDate, _ := time.Parse("2006-01-02", data.Date)

		if DataDate.Year() != year || DataDate.Month() != month {
			for DataDate.Year() != year || DataDate.Month() != month {
				if month == 1 {
					year -= 1
					month = 12
				} else {
					month -= 1
				}
			}
			Content = append(Content, []Payment{})
			i += 1
		}
		if i == -1 {
			i += 1
		}
		Content[i] = append(Content[i], data)
	}
	i = 0
	x := 0
	var Date []string
	Sum := []int{0}
	for i < len(Content) {
		for x < len(Content[i]) {
			Sum[i] += Content[i][x].Price
			x++
		}
		Sum = append(Sum, 0)
		Date = append(Date, Content[i][0].Date[:7])
		i++
		x = 0
	}
	c.JSON(200, gin.H{
		"Data": Sum,
		"Date": Date,
	})
}
