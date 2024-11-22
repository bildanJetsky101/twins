export async function sendData(data) {
  
  const decode = decodeURIComponent(data)
  const baseUrl = 'https://www.googleapis.com/customsearch/v1';

  const params = new URLSearchParams({
      key: 'AIzaSyAGgFaoUcUrD10YcguWthZBwIJmtCIdGlY',
      cx: '06414c65c987c40df',
      q: decode, 
      googlehost: 'google.id',
      hl: 'id',
      gl: 'id',
      num: 1,
      exactTerms: '_78htK'
  });
  const fixUrl = `${baseUrl}?${params.toString()}`;
  
  try {
      const response = await fetch(fixUrl);
      if (!response.ok) {
          const result = await response.json(); 

          const error = {
            code: result.error.code,
            message : result.error.message
          }
          throw new Error(` \n Code : ${error.code} \n Message : ${error.message}`)
      }

      const result = await response.json(); 
      return result

  } catch (error) {
      console.error(error);
  }
  
}
