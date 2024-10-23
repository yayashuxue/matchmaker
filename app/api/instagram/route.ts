// app/api/instagram/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
          'x-ig-app-id': '936619743392459',
          // 添加更多必要的 headers
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://www.instagram.com/',
          'cookie': 'ig_did=6F7CC024-2F40-418B-A85E-5027D22F88F2; csrftoken=missing;'
        }
      }
    );

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);

    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}: ${text}`);
    }

    const data = JSON.parse(text);
    return new Response(JSON.stringify({
      username: data.data?.user?.username,
      fullName: data.data?.user?.full_name,
      followers: data.data?.user?.edge_followed_by?.count,
      following: data.data?.user?.edge_follow?.count,
      profilePic: data.data?.user?.profile_pic_url // 添加这行
    }), {
      headers: { 'Content-Type': 'application/json' }
    });


  } catch (error) {
    console.error('Failed to fetch profile:', error);
    // 返回更详细的错误信息
    return new Response(JSON.stringify({
      error: error.message,
      details: error.toString()
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}