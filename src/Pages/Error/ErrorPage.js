import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();

    let title = "Couldn't sign in";
    let message = "Oops something went wrong";
    
    if(error.status === 500){
        message = error.data.message;
    }

    if(error.status === 404){
        title = error.data.title;
    }

    return(
        <>
            <h1>{title}</h1>
            <p>{message}</p>
        </>
    )
}

export default ErrorPage;