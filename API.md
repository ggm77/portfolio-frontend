# API 명세서

포트폴리오 사이트 백엔드 API 문서.

- Base URL: `/api/v1`
- 데이터 형식: `application/json` (이미지 업로드는 `multipart/form-data`)
- 인증: JWT Bearer 토큰. `Authorization` 헤더가 필요한 API는 아래 표에 🔒로 표시.

```
Authorization: Bearer <accessToken>
```

## 인증

### POST /api/v1/auth/login

관리자 로그인. 성공 시 access/refresh JWT를 발급한다.

**Request Body**

| 필드 | 타입 | 필수 |
|---|---|---|
| password | string | O |

**Response `200`**

```json
{
  "accessToken": "string",
  "tokenType": "bearer",
  "refreshToken": "string"
}
```

**Errors**
- `401` 비밀번호가 올바르지 않습니다.

---

## Projects (`/api/v1/projects`)

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /projects | 🔒 | 프로젝트 등록 |
| GET | /projects | - | 전체 목록 조회 (`startAt` 최신순) |
| GET | /projects/{id} | - | 단건 조회 |
| PATCH | /projects/{id} | 🔒 | 부분 수정 |
| DELETE | /projects/{id} | 🔒 | 삭제 |

**ProjectCreate**

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| name | string | O | 최대 100자 |
| tagline | string | O | 최대 200자 (한 줄 소개) |
| content | string | O | 최대 4096자 |
| highlights | string[] | - | 기본값 `[]` |
| tags | string[] | - | 기본값 `[]` |
| links | Link[] | - | 기본값 `[]`. `Link = { label: string(≤50자), url: string(≤500자) }` |
| startAt | datetime | O | |
| endAt | datetime | - | |

**ProjectUpdate**: 위 필드 전부 선택(optional). 보낸 필드만 반영됨.

**ProjectResponse**

```json
{
  "id": 1,
  "name": "FSHS",
  "tagline": "저사양 하드웨어를 위한 홈 NAS 애플리케이션",
  "content": "string",
  "highlights": ["FastAPI + 비동기 I/O로 저사양 환경에서도 낮은 지연"],
  "tags": ["FastAPI", "Python", "Docker", "Linux"],
  "links": [
    { "label": "GitHub", "url": "https://github.com/..." },
    { "label": "Demo", "url": "https://..." }
  ],
  "startAt": "2026-01-01T00:00:00",
  "endAt": null
}
```

**Errors**
- `404` 존재하지 않는 프로젝트입니다. (`GET/PATCH/DELETE /projects/{id}`)
- `401` 인증 필요 (POST/PATCH/DELETE, 토큰 없거나 유효하지 않음)

---

## History (`/api/v1/history`)

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /history | 🔒 | 이력 등록 |
| GET | /history | - | 전체 목록 조회 (`startAt` 최신순) |
| GET | /history/{id} | - | 단건 조회 |
| PATCH | /history/{id} | 🔒 | 부분 수정 |
| DELETE | /history/{id} | 🔒 | 삭제 |

**HistoryCreate**

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| club_name | string | O | 최대 100자 |
| project_name | string | O | 최대 100자 |
| content | string | O | 최대 500자 |
| startAt | datetime | O | |
| endAt | datetime | - | 진행 중이면 생략 가능 |

**HistoryUpdate**: 위 필드 전부 선택(optional). 보낸 필드만 반영됨.

**HistoryResponse**

```json
{
  "id": 1,
  "club_name": "string",
  "project_name": "string",
  "content": "string",
  "startAt": "2026-01-01T00:00:00",
  "endAt": null
}
```

**Errors**
- `404` 존재하지 않는 이력입니다.
- `401` 인증 필요

---

## Stack (`/api/v1/stacks`)

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /stacks | 🔒 | 스택 등록 |
| GET | /stacks | - | 전체 목록 조회 (`id` 역순) |
| GET | /stacks/{id} | - | 단건 조회 |
| PATCH | /stacks/{id} | 🔒 | 부분 수정 |
| DELETE | /stacks/{id} | 🔒 | 삭제 |

**StackCreate**

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| name | string | O | 최대 100자 |
| content | string[] | O | 태그 목록 |

**StackUpdate**: 위 필드 전부 선택(optional). 보낸 필드만 반영됨.

**StackResponse**

```json
{
  "id": 1,
  "name": "string",
  "content": ["string"]
}
```

**Errors**
- `404` 존재하지 않는 스택입니다.
- `401` 인증 필요

---

## Me (`/api/v1/me`)

자기소개 섹션. id 경로가 없는 **싱글턴 리소스**로, 레코드가 항상 최대 1개만 존재한다.

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /me | 🔒 | 최초 등록 (이미 있으면 실패) |
| GET | /me | - | 조회 |
| PATCH | /me | 🔒 | 부분 수정 |
| DELETE | /me | 🔒 | 삭제 |

**MeCreate**

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| headline | string | O | 최대 300자 |
| subheadline | string | O | 최대 500자 |
| tags | string[] | O | |
| content | string | O | 최대 2048자 |

**MeUpdate**: 위 필드 전부 선택(optional). 보낸 필드만 반영됨.

**MeResponse**

```json
{
  "id": 1,
  "headline": "string",
  "subheadline": "string",
  "tags": ["string"],
  "content": "string"
}
```

**Errors**
- `409` 이미 등록된 정보가 있습니다. (`POST /me`를 이미 데이터가 있는 상태에서 호출)
- `404` 등록된 정보가 없습니다. (`GET/PATCH/DELETE /me`를 데이터 없는 상태에서 호출)
- `401` 인증 필요

---

## Images (`/api/v1/images`)

Create/Read/Delete만 지원 (Update 없음 — 이미지는 교체가 아니라 삭제 후 재업로드).

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /images | 🔒 | 이미지 업로드 (`multipart/form-data`) |
| GET | /images | - | 전체 목록 조회 (`id` 역순) |
| GET | /images/{id} | - | 단건 조회 |
| DELETE | /images/{id} | 🔒 | 삭제 (DB row + 디스크 파일 모두 제거) |

**POST /images**

`multipart/form-data`로 `file` 필드에 이미지 바이너리 전송. 허용 형식: `png`, `jpeg`, `webp`, `gif`.

**ImageResponse**

```json
{
  "id": 1,
  "path": "/images/48e1a0e866984ed8b9e0dfad4128cfa8.png"
}
```

`path`는 정적 파일 서빙 경로로, 별도 인증 없이 `GET {path}`로 이미지 바이너리를 바로 받을 수 있다.

**Errors**
- `400` 지원하지 않는 이미지 형식입니다. (`POST /images`)
- `404` 존재하지 않는 이미지입니다. (`GET/DELETE /images/{id}`)
- `401` 인증 필요
