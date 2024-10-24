// app/api/instagram/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  try {
    // 使用不同的端点
    const response = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'accept': '*/*',
        'user-agent': 'Instagram 219.0.0.12.117 Android',
        'x-ig-app-id': '936619743392459',
        'origin': 'https://www.instagram.com',
        'referer': 'https://www.instagram.com/',
        'x-requested-with': 'XMLHttpRequest',
        'x-csrftoken': 'missing',
        'cookie': 'ig_did=6F7CC024-2F40-418B-A85E-5027D22F88F2; csrftoken=missing;'
      }
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200));

      const data = JSON.parse(text);
      return new Response(JSON.stringify({
        username: data.data?.user?.username,
        name: data.data?.user?.full_name,
        followers: data.data?.user?.edge_followed_by?.count,
        following: data.data?.user?.edge_follow?.count,
        profilePic: data.data?.user?.profile_pic_url
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
  } catch (error) {
    console.error('Error:', error.message);
    // Return an error response indicating that the profile was not found
    return new Response(JSON.stringify({
      error: "Profile not found",
      username: username
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}