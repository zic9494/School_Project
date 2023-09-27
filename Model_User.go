package main

type User struct {
	id        int
	username  string
	password  string
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

func (User) Get_User_Data(name string) User {
	user := User{}
	_ = db.QueryRow("select uid, name, passwrod from `user` where name = ?", name).Scan(&user.id, &user.username, &user.password)
	return user
}
