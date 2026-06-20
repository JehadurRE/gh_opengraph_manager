export const getGithubOAuthUrl = (clientId: string, redirectUri: string) => {
  const scopes = ['repo', 'user'];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};
