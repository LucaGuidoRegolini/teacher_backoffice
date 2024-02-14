import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { RefreshTokenService } from '../services/refresh_token.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class RefreshTokenController implements WebControllerInterface {
  private _refreshTokenService: RefreshTokenService;

  private constructor(refreshTokenService: RefreshTokenService) {
    this._refreshTokenService = refreshTokenService;
  }

  public static getInstance(
    refreshTokenService: RefreshTokenService,
  ): RefreshTokenController {
    return new RefreshTokenController(refreshTokenService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { refresh_token } = request.body;

    const userOrError = await this._refreshTokenService.execute({
      refresh_token,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
