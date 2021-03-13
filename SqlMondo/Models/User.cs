using System;
using System.Collections.Generic;
using System.Text;

namespace SqlMondo.Models
{
    public class User
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public User() { }
        public User(string Login, string Password)
        {
            this.Login = Login;
            this.Password = Password;
        }
    }
}
