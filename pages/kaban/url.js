export default function url(){
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4wLjg1OjUwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjgyMzgwNDIzLCJleHAiOjE2ODUwMDg0MjMsIm5iZiI6MTY4MjM4MDQyMywianRpIjoiWVFaSEp2cmRpdHJsRFFydSIsInN1YiI6IjIiLCJwcnYiOiI0YTU2OGU0ZDM2NGEyMmRlY2FhYTJlMjNhM2Y3NDNmNzhhYWYxNTllIn0.itWbAmYSvB8NAmQ-jotwi6vxRrrV595uJurceYn2qA4'
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return {url: 'http://10.86.32.44:80/api-moinhos-production/public/api', config: config}
}