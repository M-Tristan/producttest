import {
  ElButton,
  ElDialog,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElSteps,
  ElStep
} from 'element-plus'

const elementUse = (app) => {
  app.component(ElButton.name, ElButton)
  app.component(ElDialog.name, ElDialog)
  app.component(ElInput.name, ElInput)
  app.component(ElRadioGroup.name, ElRadioGroup)
  app.component(ElRadio.name, ElRadio)
  app.component(ElSteps.name, ElSteps)
  app.component(ElStep.name, ElStep)
}

export { elementUse }

export default elementUse
