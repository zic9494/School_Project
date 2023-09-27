package main

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Update_Bill_Data(c *gin.Context) {
	var fail error = nil
	session := sessions.Default(c)
	Data := Create_bill_Return_Model(c)
	User := User{}
	User = User.Get_User_Data(session.Get("UserInfo").(string))

	if !Data.Delete {
		switch {
		case Data.ReturnType == "payment":
			fail = Data.Payment_Update()
		case Data.ReturnType == "income":
			fail = Data.Income_Update()
		case Data.ReturnType == "debt":
			fail = Data.Debt_Update()
		case Data.ReturnType == "assets":
			fail = Data.Assets_Update()
		default:
			c.JSON(400, gin.H{
				"Message": "ReturnType Error",
			})
		}
	} else {
		switch {
		case Data.ReturnType == "payment":
			fail = Data.Payment_Delete()
		case Data.ReturnType == "income":
			fail = Data.Payment_Delete()
		case Data.ReturnType == "debt":
			fail = Data.Debt_Delete()
		case Data.ReturnType == "assets":
			fail = Data.Assets_Delete()
		default:
			c.JSON(400, gin.H{
				"Message": "ReturnType Error",
			})
		}
	}
	if fail != nil {
		c.JSON(500, gin.H{
			"Message": fail,
		})
	} else {
		c.Redirect(301, "/")
	}
}
