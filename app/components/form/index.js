import {compose, setNodeName} from '/util/compose'

import {updateFormData} from './actions'

const {cloneElement} = Preact

export const Form = compose(
  setNodeName('Form'),
  function init () {
    console.log('init Form', this)
  },
  function updateProps (children) {
    const names = ['TextField', 'TextArea', 'RadioField']
    for (var x = 0; x < children.length; x++) {
      if (children[x].nodeName && names.indexOf(children[x].nodeName.name) > -1) {
        const name = children[x].attributes.name
        children[x] = cloneElement(children[x], {
          formName: this.props.name,
          value: (this.props.data || {})[name],
          dispatch: this.props.dispatch
        })
      }
      if (children[x].children && children[x].children.length) {
        children[x].children = this.updateProps(children[x].children)
      }
    }
    return children
  },
  function render ({onSubmit, children, updateProps, data, ...props}) {
    const childrenWithProps = updateProps(children)
    return <form
      onSubmit={(ev) => ev.preventDefault() || onSubmit(data)}
      {...props}
    >
      {childrenWithProps}
    </form>
  }
)

export const FormHeading = ({children}) =>
  <div class='form-heading'>{children}</div>

export const FormGroup = ({children}) =>
  <div className='form-group'>{children}</div>

export const FormRow = ({children}) =>
  <div className='form-row'>{children}</div>

export const FieldSet = ({className, children}) =>
  <fieldset class={className || ''}>{children}</fieldset>

export const TextField = ({
  type = 'text',
  placeholder,
  formName,
  name,
  value,
  dispatch,
  ...props
}) =>
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onInput={(ev) =>
      ev.preventDefault() ||
      dispatch(updateFormData(formName, {[name]: ev.target.value}))
    }
    {...props}
  />

export const RadioField = ({
  formName,
  name,
  value,
  checked,
  dispatch,
  ...props
}) =>
  <input
    type='radio'
    name={name}
    checked={checked}
    onChange={(ev) =>
      ev.preventDefault() ||
      dispatch(updateFormData(formName, {[name]: value}))
    }
    {...props}
  />
