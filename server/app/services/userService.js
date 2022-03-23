export async function register(user) {
  let payload = {
    username: user.username,
    email: user.email,
    password: user.password,
  };
  const res = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}

export async function login(user) {
  let payload = {
    email: user.email,
    password: user.password,
  };
  const res = await fetch("http://localhost:5000/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res;
  // const data = await res.json();
  // console.log(`from userService ${data.token}`);
  // return data;
}

export async function checkToken() {
  const res = await fetch("http://localhost:5000/api/auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  });
  return res;
}
