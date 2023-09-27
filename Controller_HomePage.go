package main

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Home(c *gin.Context) {
	session := sessions.Default(c)
	name := session.Get("UserInfo")
	if name == nil {
		c.Redirect(301, "/user/login")
	} else {
		Page(c, name.(string))
	}
}

func Page(c *gin.Context, username string) {
	User := User{}
	User = User.Get_User_Data(username)
	respone := struct {
		Name      string
		Liquidity int
	}{
		User.Name(),
		User.Liquidity(),
	}
	c.HTML(200, "HomePage.html", gin.H{
		"Name":      respone.Name,
		"Liquidity": respone.Liquidity,
	})

}
