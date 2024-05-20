import { Form, json, redirect } from "react-router-dom";
import './RegisterPage.css';

function RegisterPage(){
    return(
       <div>
             <div>
                <h1>UTube</h1>
                <div>
                <h2>Create a UTube Account</h2>
                </div>
             </div>
                <Form method="post">
                    <input id="email" type="email" name="email" placeholder="Email"/><br/>
                    <input id="channel" type="text" name="channel" placeholder="Channel Name"/><br/>
                    <input id="password" type="password" name="password" placeholder="Password"/><br/>
                    <input id="confirm-password" type="password" name="confirm-password" placeholder="Confirm Password"/><br/>    
                    <button>sign up</button>                   
                </Form>
        </div>
    )
}

export default RegisterPage;

export async function action({request}){
    // to get data from the form
    const data = await request.formData();

    const registerData = {
        channelName: data.get('channel'),
        email: data.get('email'),
        password: data.get('password'),
    };
    console.log(registerData)

    const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
    });
    console.log(response)

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if(!response.ok){
        throw json({message: 'Bad request'}, {status: 500})
    }

    const resData = await response.json();
    const token = resData.token;

    localStorage.setItem('token', token);

    return redirect('/');
    }