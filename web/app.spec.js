import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { expect } from 'chai';



import App from './src/App.vue'

describe('web', () => {
  
  it('renders the component', () => {
    const wrapper = mount(App)
    expect(wrapper).toBeTruthy()
  })

  it('sets the initial value of nQueens to 4', () => {
    const wrapper = mount(App)
    expect(wrapper.vm.nQueens).toBe(4)
    })

})
