package main

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	c.HTML(200, "LogIn.html", gin.H{
		"message": "Retuen HTML file",
	})
}

func Login_Data(c *gin.Context) {
	User := User{}
	User = User.Get_User_Data(c.PostForm("name"))
	result := User.check_passwrod(c.PostForm("password"), c.PostForm("name"))
	if result == true {
		session := sessions.Default(c)
		session.Set("UserInfo", User.Name())
		session.Save()
		c.Redirect(301, "/")
	} else {
		c.Redirect(301, "/user/login")
	}
}
