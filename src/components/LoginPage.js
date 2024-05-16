import { Form, json, redirect } from "react-router-dom";

function LoginPage(){
    return(
       <div>
             <div>
                <h1>UTube</h1>
                <div>
                <h2>Sign in</h2>
                <span>to continue to UTube</span>
                </div>
             </div>
                <Form method="post">
                    <input id="email" type="email" name="email" placeholder="Email"/><br/>
                    <input id="password" type="password" name="password" placeholder="Password"/><br/>   
                    <Link to="/signin"/><button>create account</button> 
                    <button>sign in</button>                  
                </Form>
        </div>
    )
}

export default LoginPage;

export async function action({request}){
    // to get data from the form
    const data = await request.formData();
    const registerData = {
        email: data.get('email'),
        password: data.get('password')
    };

    console.log(registerData)

    const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    });
    console.log(response)

    console.log(await response.json())
    if(response.status === 404 || response.status === 401){
        return response;
    }

    if(!response.ok){
        throw json({message: 'Bad request'}, {status: 500})
    }

    const resData = await response.json();
    const token = resData.token;

    localStorage.setItem('token', token);

    return redirect('/home');
    }