export default function getUserIdFromToken() {
  const token = localStorage.getItem('token');

  if (token) {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payloadBase64));
    const userId = decoded.UserId || decoded.userId || decoded.sub;
    return userId;
  }
}
