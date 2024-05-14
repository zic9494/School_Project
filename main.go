package main

import (
	"database/sql"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func init() {
	db, _ = sql.Open("mysql", "admin:a5770a5770@tcp(127.0.0.1:3306)/project")
}

func Peko(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Peko",
	})
}
func main() {
	router := gin.Default()
	router.LoadHTMLGlob("./HTML/*.html")
	router.Static("/CSS", "./CSS/")
	router.Static("/JS", "./JS/")
	router.Static("/ChartJS", "./node_modules/chart.js/dist/")
	store := cookie.NewStore([]byte("Token"))
	router.Use(sessions.Sessions("mysession", store))

	router.GET("/", Home)
	User := router.Group("/user")
	{
		User.GET("/login", Login)
		User.POST("/login", Login_Data)
		User.GET("/signup", Signup)
		User.POST("/signup", Signup_data)
	}

	Data := router.Group("data")
	{
		Data.GET("/payment", Payment_data)
		Data.GET("/debt", Debt_Data)
		Data.GET("/assets", Assets_Data)
		Data.GET("/netassets", NetAsset_Data)
	}

	Bill := router.Group("bill")
	{
		Bill.POST("/now", Now_Bill_Data)
		Bill.POST("/update", Update_Bill_Data)
	}
	router.Run(":8086")
}
