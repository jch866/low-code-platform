function useEvent(props) {
  const handleEyeClick = (event, column, eyeStatus) => {
    event.stopPropagation()
    if (!column.showEye) return
    column.eyeStatus = eyeStatus
    props.store.updateColumns()
  }

  return {
    handleEyeClick
  }
}

export default useEvent
