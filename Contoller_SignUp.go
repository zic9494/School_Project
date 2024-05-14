package main

import (
	"github.com/gin-gonic/gin"
)

func Signup(c *gin.Context) {
	c.HTML(200, "SignUp.html", gin.H{
		"message": "Return HTML file",
	})
}
