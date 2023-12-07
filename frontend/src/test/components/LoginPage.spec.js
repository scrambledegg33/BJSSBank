const { mount } = require('@vue/test-utils');
const LoginPage = require('../../components/LoginPage.vue');

describe('LoginPage', () => {
  it('renders the login form', () => {
    const wrapper = mount(LoginPage);

    // Check if the login form is rendered
    const usernameInput = wrapper.find('#username');
    const passwordInput = wrapper.find('#password');
    const loginButton = wrapper.find('button[data-test="login-button"]');
    const createUserButton = wrapper.find('button[data-test="create-user-button"]');

    expect(usernameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    expect(loginButton.exists()).toBe(true);
    expect(createUserButton.exists()).toBe(true);
  });

  it('emits login event when clicking the login button', async () => {
    const wrapper = mount(LoginPage);

    // Set input values
    const usernameInput = wrapper.find('#username');
    const passwordInput = wrapper.find('#password');
    await usernameInput.setValue('testuser');
    await passwordInput.setValue('testpassword');

    // Click the login button
    const loginButton = wrapper.find('button[data-test="login-button"]');
    await loginButton.trigger('click');

    // Check if the login event was emitted with the correct data
    expect(wrapper.emitted('login')).toHaveLength(1);
    expect(wrapper.emitted('login')[0][0]).toEqual({
      username: 'testuser',
      password: 'testpassword',
    });
  });

  it('redirects to create-user page when clicking the create user button', async () => {
    const $router = {
      push: jest.fn(),
    };

    const wrapper = mount(LoginPage, {
      global: {
        mocks: {
          $router,
        },
      },
    });

    // Click the create user button
    const createUserButton = wrapper.find('button[data-test="create-user-button"]');
    await createUserButton.trigger('click');

    // Check if the router was called with the correct path
    expect($router.push).toHaveBeenCalledWith('/create-user');
  });

  // Add more test cases as needed
});