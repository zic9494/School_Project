package main

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Now_Bill_Data(c *gin.Context) {
	session := sessions.Default(c)
	Data := Create_bill_Return_Model(c)
	User := User{}
	User = User.Get_User_Data(session.Get("UserInfo").(string))
	var fail error = nil
	switch {
	case Data.ReturnType == "payment":
		fail = Data.Payment(User.ID())
	case Data.ReturnType == "income":
		fail = Data.Income(User.ID())
	case Data.ReturnType == "debt":
		fail = Data.Debt(User.ID())
	case Data.ReturnType == "assets":
		fail = Data.Assets(User.ID())
	case Data.ReturnType == "netassets":
		fail = Data.NetAsset(User.ID())
	default:
		c.JSON(400, gin.H{
			"Message": "ReturnType Error",
		})
	}

	if fail != nil {
		c.JSON(500, gin.H{
			"Message": fail,
		})
	} else {
		c.Redirect(301, "/")
	}
}
