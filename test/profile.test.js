const { createProfile } = require('../controllers/profileController');
const { getProfileById } = require('../controllers/profileController');
const Profile = require('../models/profile');
const httpMocks = require('node-mocks-http');

jest.mock('../models/profile');

describe('Profile Controller - createProfile', () => {
  it('should create a new profile', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/profile',
      body: {
        name: "Test User",
        description: "Test User",
        mbti: "INTJ",
        enneagram: "5w6",
        variant: "sp/sx",
        tritype: 531,
        socionics: "LII",
        sloan: "ROEAN",
        psyche: "INTJ",
        image: "https://example.com/john_doe_image.jpg"
    },
    });

    const mockResponse = httpMocks.createResponse();
    const mockNext = jest.fn();  

    Profile.create.mockResolvedValueOnce({
        _id: 'mockedProfileId',
        name: "Test User",
        description: "Test User",
        mbti: "INTJ",
        enneagram: "5w6",
        variant: "sp/sx",
        tritype: 531,
        socionics: "LII",
        sloan: "ROEAN",
        psyche: "INTJ",
        image: "https://example.com/john_doe_image.jpg"
    });

    await createProfile(mockRequest, mockResponse, mockNext);

    const jsonResponse = JSON.parse(mockResponse._getData());
    expect(mockResponse.statusCode).toBe(201);
    expect(jsonResponse._id).toBe('mockedProfileId');
    expect(jsonResponse.name).toBe('Test User');

    expect(mockNext).not.toHaveBeenCalled();
  });
});


describe('Profile Controller - getProfileById', () => {
  const sampleProfile = {
    _id: '659d709203383b5948c81657',
    name: 'John Doe',
    description: 'A sample profile description',
    mbti: 'INTJ',
    enneagram: '5w6',
    variant: 'sp/sx',
    tritype: 531,
    socionics: 'LII',
    sloan: 'ROEAN',
    psyche: 'INTJ',
    image: 'https://example.com/john_doe_image.jpg',
    __v: 0,
  };

  it('should get a profile by ID successfully', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'GET',
      url: '/profile/:id',
      params: {
        id: '659d709203383b5948c81657',
      },
    });

    const mockResponse = httpMocks.createResponse();
    const mockNext = jest.fn();

    jest.spyOn(Profile, 'findById').mockResolvedValueOnce(sampleProfile);

    await getProfileById(mockRequest, mockResponse, mockNext);

    expect(mockResponse.statusCode).toBe(200);

    expect(mockResponse._getRenderView()).toBe('profile_template');
    expect(mockResponse._getRenderData().profile).toEqual(sampleProfile);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle profile not found', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'GET',
      url: '/profile/:id',
      params: {
        id: '659d709203383b5948c81612', // Use an invalid profile ID
      },
    });

    const mockResponse = httpMocks.createResponse();
    const mockNext = jest.fn();

    jest.spyOn(Profile, 'findById').mockResolvedValueOnce(null);

    await getProfileById(mockRequest, mockResponse, mockNext);

    expect(mockResponse.statusCode).toBe(404);
    expect(mockResponse._isEndCalled()).toBeTruthy();

    expect(mockNext).not.toHaveBeenCalled();
  });
});