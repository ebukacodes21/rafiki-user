const api_base_url = process.env.NEXT_PUBLIC_BASE_API_URL!  

const ApiConfig = {
    signup: `${api_base_url}/firm/register-client`,
    signupGoogle: `${api_base_url}/firm/register-client-google`,
    login: `${api_base_url}/firm/login-client`,
    loginGoogle: `${api_base_url}/firm/login-client-google`,

    findAccount: `${api_base_url}/firm/find-account`,
    verify: `${api_base_url}/firm/verify`,
    resend: `${api_base_url}/firm/resend-code`,
    forgot: `${api_base_url}/firm/forgot`,
    reset: `${api_base_url}/firm/reset`,

    upload: `${api_base_url}/firm/upload`,

    confirmConsultation: `${api_base_url}/firm/confirm-consulation`,
    getBookedSlots: `${api_base_url}/firm/get-booked-slots`,
}

export default ApiConfig;