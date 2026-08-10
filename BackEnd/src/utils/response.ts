import { Response } from "../models/global-response-interface";

const ResponseEntity = {
  success<T>(res: any, code: number, data: T) {
    const response: Response.Success<T> = {
      code,
      success: true,
      data,
    }
    return res.status(code).json(response);
  },

  error(res: any, code: number, errorMsg: string) {
    const response: Response.Error = {
      code,
      success: false,
      data: { errorMsg },
    }
    return res.status(code).json(response);
  },
};

export default ResponseEntity;
