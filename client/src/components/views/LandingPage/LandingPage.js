import React, {useState} from 'react'
import axios from 'axios'

function LandingPage() {
    
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState('')
    
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //이걸 해주면 로그인을 눌러도 refresh가 안됨
        
        let body = {
            email : Email,
            password : Password
        };

        axios.post('/api/users/login', body)
        .then(response => {
            console.log(response)
            if(!response.data.loginSuccess) alert(response.data.message)
            else alert("로그인 성공")
        });
        
    }

    // const test = useEffect(() => {
    //     axios.get('/api/hello')
    //     .then(response => {console.log(response.data)})
    // })
    
    return (
        <div className="text-center sing-in-body">
            <form className="form-signin" onSubmit={onSubmitHandler}>
                <h1 className="h3 mb-3 font-weight-normal">로그인</h1>

                <input type="email" id="inputEmail" className="form-control" placeholder="이메일" value={Email} onChange={onEmailHandler}  autoFocus/>
                <input type="password" id="inputPassword" className="form-control" placeholder="비밀번호" value={Password} onChange={onPasswordHandler}  />
				
				<a href="/register">회원가입</a>
				
                <button className="btn btn-lg btn-primary btn-block" type="submit">로그인</button>
            </form>
        </div>
    ) 
}

export default LandingPage
