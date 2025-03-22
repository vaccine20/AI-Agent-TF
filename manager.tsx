import { navigate } from "gatsby";
import React, { useEffect, useState, useContext, ChangeEvent, KeyboardEvent } from "react";
import { appContext } from "../../../hooks/provider";
import { loginAPI } from "./api";
import { Button } from "antd";
import { getLocalStorage, setLocalStorage } from "../../utils";

export const LoginManager = () => {
  
  const [ loginInfo, setLoginInfo ] = useState({ email: '', password: '' });
  const { setUser } = useContext(appContext);
  const [ isRemember, setIsRemember ] = useState(false);
  
  const regex_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i

  useEffect(() => {
    
    localStorage.removeItem('kai-token');

    const storeIsRemember = getLocalStorage('isRemember') ?? false;
    setIsRemember(storeIsRemember);

    if (storeIsRemember) {
      const storeUserId = getLocalStorage('userId') ?? '';
    
      setLoginInfo({
        email: storeUserId,
        password: ''
      });
    }

  }, [])

  const handleLoginInfo = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev, [name]: value
    }));
  }

  const handleEnter = (e : KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handleLogin();
    }
  }

  const handleRememberId = (e : ChangeEvent<HTMLInputElement>) => {
    setIsRemember(e.target.checked);

    setLocalStorage('isRemember', e.target.checked);
  }

  const handleLogin = async () => {
    
    if (!loginInfo.email.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    if (!regex_email.test(loginInfo.email.trim())) {
      alert('이메일 형식에 맞게 정확히 입력해주세요.');
      return;
    }
    
    if (!loginInfo.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const response = await loginAPI.login(loginInfo);

    if (response.detail?.message == 'Invalid password') {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setUser({
      name : loginInfo.email.split('@')[0],
      email : loginInfo.email,
      username : loginInfo.email.split('@')[0]
    })
    
    setLocalStorage('userId', loginInfo.email);
    setLocalStorage('kai-token', response.data, false);

    navigate('/build', { replace: true });
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col">
        <div>
          <input
            type="email"
            className={`appearance-none w-full h-[3.25rem] px-4 mb-4 rounded-lg py-1 border border-gray-200 hover:border-gray-300 hover:shadow-sm 
              focus:outline-none focus:border-accent placeholder-black sm:text-sm font-bold`}
            placeholder="ID"
            name="email"
            onChange={handleLoginInfo}
            onKeyDown={handleEnter}
            value={loginInfo.email ?? ''}
          />
        </div>
        <div>
          <input
            type="password"
            className={`appearance-none w-full h-[3.25rem] px-4 mb-4 rounded-lg py-1 border border-gray-200 hover:border-gray-300 hover:shadow-sm 
              focus:outline-none focus:border-accent placeholder-black sm:text-sm font-bold`}
            placeholder="PW"
            name="password"
            onChange={handleLoginInfo}
            onKeyDown={handleEnter}
          />
        </div>
        <div className="flex mb-12">
          <input
            type="checkbox"
            className='w-4 mr-2'
            onChange={handleRememberId}
            checked={isRemember}
          />
          <span>{'아이디 기억하기'}</span>
        </div>
        <div>
        <Button
          type="primary"
          className='w-full h-12 text-base hover:bg-hoveraccent'
          onClick={handleLogin}
        >
          {'로그인'}
        </Button>
        </div>
      </div>
      
      
    </div>
  );
};
