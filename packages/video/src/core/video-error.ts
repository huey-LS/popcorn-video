export const ErrorCodes: {
  [propsName: string]: string|number
} = {
  CUSTOM: 'custom',
  MEDIA_ERR_ABORTED: 1,
  MEDIA_ERR_NETWORK: 2,
  MEDIA_ERR_DECODE: 3,
  MEDIA_ERR_NETWORK_TIMEOUT: 'timeout',
  MEDIA_ERR_SOURCE_INVALID: 4
}

export const ErrorMessages = {
  [ErrorCodes.CUSTOM]: '',
  [ErrorCodes.MEDIA_ERR_ABORTED]: '网络错误',
  [ErrorCodes.MEDIA_ERR_NETWORK]: '网络错误',
  [ErrorCodes.MEDIA_ERR_DECODE]: '视频解析错误',
  [ErrorCodes.MEDIA_ERR_NETWORK_TIMEOUT]: '网络错误',
  [ErrorCodes.MEDIA_ERR_SOURCE_INVALID]: '视频资源有误'
}

export class VideoError {
  code: string|number = ErrorCodes.CUSTOM;
  _custom_message = '';

  get message () {
    let message = ''
    if (this._custom_message) {
      message = this._custom_message;
    } else if (ErrorMessages[this.code]) {
      message = ErrorMessages[this.code];
    }
    return message
  }

  setCode (errorCode: string|number) {
    this.code = errorCode;
  }

  setMessage (message: string) {
    this._custom_message = message;
  }
}
