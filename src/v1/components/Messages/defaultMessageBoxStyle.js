const fontSize = 16;
const lineHeight = 1.2;

export default {
  control: {
    fontSize,
    lineHeight
  },

  '&multiLine': {
    control: {
      fontSize,
      lineHeight
    },

    highlighter: {
      padding: 12,
      minHeight: fontSize * lineHeight,
      maxHeight: fontSize * lineHeight * 30,
      height: '100%',
      border: 'none',
      borderBottom: '1px solid transparent'
    },

    input: {
      fontSize,
      lineHeight,
      minHeight: fontSize * lineHeight,
      maxHeight: fontSize * lineHeight * 30,
      height: '100%',
      padding: 12,
      border: 'none',
      borderBottom: '1px solid #D8E5EE'
    }
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: 4,
      fontSize
    },

    item: {
      padding: '5px 10px',
      minWidth: '375px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',

      '&focused': {
        backgroundColor: '#cee4e5'
      }
    }
  }
};
