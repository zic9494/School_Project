package main

import (
	"fmt"
)

type User struct {
	id        int
	username  string
	password  string
	user_type string
	liquidity int
}

func (u User) check_passwrod(inp_password string, Name string) (result bool) {
	if inp_password == u.password {
		return true
	} else {
		return false
	}
}

func (u User) ID() int {
	return u.id
}

func (u User) Name() string {
	return u.username
}

func (u User) Liquidity() int {
	return u.liquidity
}

func (u User) Check_Account() {

}
func (User) Get_User_Data(name string) User {
	user := User{}
	_ = db.QueryRow("select uid, name, passwrod from `user` where name = ?", name).Scan(&user.id, &user.username, &user.password)
	return user
}

func (u User) Write_Data(Id int, Username string, Password string, UserType string, Liquidity int) User {
	u.id = Id
	u.username = Username
	u.password = Password
	u.user_type = UserType
	u.liquidity = Liquidity
	return u
}

func (u User) Register() error {
	var ID int
	tx, err := db.Begin()
	if err != nil {
		if tx != nil {
			tx.Rollback()
		}
		fmt.Println(err)
		return err
	}
	err = db.QueryRow("SELECT COUNT(*) FROM user").Scan(&ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = db.Exec("INSERT INTO `user`(name, passwrod, liquidity) VALUES (?, ?, ?)", u.username, u.password, u.liquidity)
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = db.Exec("INSERT INTO `user_type`(user_type, who) VALUE( ?, ?)", u.user_type, ID+1)
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}
