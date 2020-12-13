interface ParamsDictionary {
  [key: string]: string;
}

export namespace API {
  export namespace V1 {
    export namespace Register {
      export namespace POST {
        export interface RequestBody {
          google_id_token: string;
          student_email: string;
          a: {
            b: string
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Response {}
      }
      export namespace GET {
        export namespace Verify {
          export interface RequestParams extends ParamsDictionary {
            tracking_id: string;
          }
        }
        export namespace Activated {
          export interface Response {
            activated: boolean;
            access_token: string;
          }
        }
      }
    }
    export namespace Login {
      export namespace POST {
        export interface RequestBody {
          google_id_token: string;
        }
        export interface Response {
          access_token: string;
        }
      }
    }
  }
}
