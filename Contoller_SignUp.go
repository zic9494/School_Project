package main

import (
	"github.com/gin-gonic/gin"
)

func Signup(c *gin.Context) {
	c.HTML(200, "SignUp.html", gin.H{
		"message": "Return HTML file",
	})
}

func Signup_data(c *gin.Context) {
	Data := User{}.Write_Data(-1, c.PostForm("name"), c.PostForm("password"), c.PostForm("user_type"), 0)
	err := Data.Register()
	if err != nil {
		c.JSON(500, gin.H{
			"Data": err,
		})
	} else {
		c.Redirect(302, "/user/login")
	}

}
