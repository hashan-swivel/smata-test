// Add label and value fields to items for use with React Select component
export const addLabelToTags = (arr) =>
  arr.map((item) => ({ ...item, label: item.name, value: item.name }));

export const addLabelValues = (arr) =>
  arr.map((item) => ({ ...item, label: item.name, value: item.id }));

export const addLabelToBusinessNumber = (arr) =>
  arr.map((item) => ({ ...item, label: item.abn, value: item.abn }));

export const addLabelValueToReportTypes = (arr) =>
  arr.map((item) => ({ ...item, label: item.title, value: item.id }));

export const addLabelToSpList = (arr) => {
  const list = [];
  arr.forEach((item) => {
    if (item.locations.length >= 2) {
      item.locations.forEach((_loc, index) =>
        list.push({
          ...item,
          disabled: item.state !== 'active',
          label: item.locations[index].location_name,
          value: item.name
        })
      );
    } else {
      list.push({
        ...item,
        disabled: item.state !== 'active',
        label: item.locations && item.locations.length ? item.locations[0].location_name : '',
        value: item.name
      });
    }
  });

  return list;
};

export const addLabelToCategory = (name) => ({ label: name, value: name });

export const addLabelToLotNumber = (name, id) => ({ label: name, value: id });

// API responses returns different user objects, userOptionObj will normalize
export const userOptionObj = (user = {}, strict = false) => {
  const firstName = user.first_name || user.firstName;
  const lastName = user.last_name || user.lastName;
  const fullName =
    user.full_name?.trim() ||
    [firstName, lastName]
      .filter((e) => e !== null && e !== '')
      .join(' ')
      .trim();

  const userObj = {
    id: user.user_id || user.id,
    value: user.user_id || user.id,
    image: user.image,
    role: user.role,
    label: fullName,
    userName: fullName,
    isDisabled: user.is_displayed_in_contact_list === false,
    firstName,
    lastName,
    fullName
  };

  return strict ? userObj : { ...user, ...userObj };
};

export const addLabelToDocs = (arr) =>
  arr.map((doc) => ({
    value: doc.id,
    name: doc.filename,
    label: doc.display_name,
    category: doc.category
  }));
