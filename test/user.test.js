const httpMocks = require('node-mocks-http');
const { createUser } = require('../controllers/userController');
const User = require('../models/User');

jest.mock('../models/User');

describe('User Controller - createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/user',
      body: {
        username: 'newuser',
        email: 'newuser@example.com',
        name: 'New User',
      },
    });

    const mockResponse = httpMocks.createResponse();
    const mockNext = jest.fn();

    User.findOne.mockResolvedValueOnce(null);

    User.create.mockResolvedValueOnce({
      _id: 'mockUserId',
      username: 'newuser',
      email: 'newuser@example.com',
      name: 'New User',
    });

    await createUser(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(mockResponse.statusCode).toBe(201);
    expect(mockResponse._isEndCalled()).toBeTruthy();
    expect(mockResponse._getJSONData()).toEqual({
      _id: 'mockUserId',
      username: 'newuser',
      email: 'newuser@example.com',
      name: 'New User',
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle username already exists', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/user',
      body: {
        username: 'existinguser',
        email: 'existinguser@example.com',
        name: 'Existing User',
      },
    });

    const mockResponse = httpMocks.createResponse();
    const mockNext = jest.fn();

    User.findOne.mockResolvedValueOnce({
      _id: 'existingUserId',
      username: 'existinguser',
      email: 'existinguser@example.com',
      name: 'Existing User',
    });

    await createUser(mockRequest, mockResponse, mockNext);

    expect(mockResponse.statusCode).toBe(400);
    expect(mockResponse._isEndCalled()).toBeTruthy();
    expect(mockResponse._getJSONData()).toEqual({ message: 'Username already exists' });


    expect(mockNext).not.toHaveBeenCalled();
  });

});
