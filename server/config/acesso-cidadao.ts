const _identityServerUrl = process.env.IDENTITY_SERVER_URL || 'https://acessocidadao.es.gov.br/is/'
const _userInfoUrl = process.env.USER_INFO_URL || `${_identityServerUrl}connect/userinfo`

export const identityServerUrl = _identityServerUrl
export const userInfoUrl = _userInfoUrl
export const jwtPublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArYaYlPnnrxBVwC4o0ykG\nVg8gjH/TerrrXS3GmsZeON6SCNuOBzUj+7RiEF64lE//gLY01nTJZtnUIPvmKJW/\n1+eWxGNW1Mh1JpT/f3A6Q5rp2WNKSBwvEFPE58lkD63Tewsn3+0dw+aFKaSW+l3A\nZ7WS4AxXxBLIRr2zpTL3DOCbeT/m2yEQ8Do662/d+ty7F08FJVaaz2PxmnLEeSQX\n6RTRPeFRPlGVj91H4h85Ln+0Oc0U/oiqa+AKwobWXLOqDKhn8HYZuoya368TqZ9X\n26QEp1g7psaT8kiNRFAt0Yb4WbgFSWf2r92HDS8dj25TNTeeLkvZ48KylTKU23DT\nqQIDAQAB\n-----END PUBLIC KEY-----'
