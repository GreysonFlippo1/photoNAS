import * as React from 'react'

export const Login = () => {

    return <div className='loginContainer'>
        <div className='loginBox'>
            <h1>Login</h1>
            <form action="#" className='loginForm'>
                <label htmlFor="email">Email</label><br />
                <input type="text" id="email" name="email" className='textBox' placeholder='example@email.com'/><br />
                <label htmlFor="password">Password</label><br />
                <input type="password" id="password" name="password" className='textBox' placeholder='password' /><br />
                <input type="submit" value="Login" className='buttonPrimary greenButton loginButton' />
            </form> 
        </div>
    </div>
}
