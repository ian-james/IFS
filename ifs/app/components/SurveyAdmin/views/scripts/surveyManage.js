const destroySurvey = (id) => {
  if (confirm('Do you really want to delete this survey?  This removes all associated questions and responses...')) {
    $.ajax({
      url: `/admin/surveys/delete/${id}`,
      type: 'DELETE'
    })
    .then((res) => {
      window.location.replace('/admin/surveys');
    });
  }
}