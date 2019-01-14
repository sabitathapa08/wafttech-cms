const httpStatus = require('http-status');
const otherHelper = require('../../helper/others.helper');
const roleSch = require('./roleShema');
const moduleSch = require('./moduleShema');
const accessSch = require('./accessShema');
const roleConfig = require('./roleConfig');
const roleController = {};

roleController.GetRoles = async (req, res, next) => {
  const size_default = 10;
  let page;
  let size;
  let searchq;
  let sortq;
  let selectq;
  if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
    page = Math.abs(req.query.page);
  } else {
    page = 1;
  }
  if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
    size = Math.abs(req.query.size);
  } else {
    size = size_default;
  }
  if (req.query.sort) {
    let sortfield = req.query.sort.slice(1);
    let sortby = req.query.sort.charAt(0);
    console.log(sortfield);
    if (sortby == 1 && !isNaN(sortby) && sortfield) {
      //one is ascending
      sortq = sortfield;
    } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
      //zero is descending
      sortq = '-' + sortfield;
    } else {
      sortq = '';
    }
  }

  if (req.query.find_RolesTitle) {
    searchq = { RolesTitle: { $regex: req.query.find_RolesTitle, $options: 'i x' }, ...searchq };
  }
  selectq = 'RolesTitle Description IsActive';

  let datas = await otherHelper.getquerySendResponse(roleSch, page, size, sortq, searchq, selectq, next, '');

  return otherHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, roleConfig.roleGet, page, size, datas.totaldata);
};
roleController.GetRoleDetail = async (req, res, next) => {
  const roles = await roleSch.findById(req.params.id, { IsActive: 1, RolesTitle: 1, Description: 1 });
  return otherHelper.sendResponse(res, httpStatus.OK, true, roles, null, roleConfig.roleGet, null, 'Role Not Found');
};
roleController.AddRoles = async (req, res, next) => {
  try {
    const role = req.body;
    if (role._id) {
      const update = await roleSch.findByIdAndUpdate(role._id, { $set: role }, { new: true });
      return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, 'Role Saved Success !!', null);
    } else {
      role.Added_by = req.user.id;
      const newRole = new roleSch(role);
      await newRole.save();
      return otherHelper.sendResponse(res, httpStatus.OK, true, newRole, null, 'Role Saved Success !!', null);
    }
  } catch (err) {
    next(err);
  }
};

roleController.GetModule = async (req, res, next) => {
  const size_default = 10;
  let page;
  let size;
  let searchq;
  let sortq;
  let selectq;
  if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
    page = Math.abs(req.query.page);
  } else {
    page = 1;
  }
  if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
    size = Math.abs(req.query.size);
  } else {
    size = size_default;
  }
  if (req.query.sort) {
    let sortfield = req.query.sort.slice(1);
    let sortby = req.query.sort.charAt(0);
    console.log(sortfield);
    if (sortby == 1 && !isNaN(sortby) && sortfield) {
      //one is ascending
      sortq = sortfield;
    } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
      //zero is descending
      sortq = '-' + sortfield;
    } else {
      sortq = '';
    }
  }

  if (req.query.find_ModuleName) {
    searchq = { ModuleName: { $regex: req.query.find_ModuleName, $options: 'i x' }, ...searchq };
  }
  selectq = 'ModuleName Description Order Path';

  let datas = await otherHelper.getquerySendResponse(moduleSch, page, size, sortq, searchq, selectq, next, '');

  return otherHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, roleConfig.gets, page, size, datas.totaldata);
};
roleController.GetModuleDetail = async (req, res, next) => {
  const modules = await moduleSch.findById(req.params.id);
  return otherHelper.sendResponse(res, httpStatus.OK, true, modules, null, roleConfig.moduleGet, null, 'Module Not Found');
};
roleController.AddModulList = async (req, res, next) => {
  try {
    const modules = req.body;
    if (modules._id) {
      const update = await moduleSch.findByIdAndUpdate(modules._id, { $set: modules }, { new: true });
      return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, roleConfig.moduleSave, null);
    } else {
      modules.Added_by = req.user.id;
      const newModules = new moduleSch(modules);
      await newModules.save();
      return otherHelper.sendResponse(res, httpStatus.OK, true, newModules, null, roleConfig.moduleSave, null);
    }
  } catch (err) {
    next(err);
  }
};
roleController.GetAccessList = async (req, res, next) => {
  try {
    const access = await accessSch.find({}, { _id: 1, IsActive: 1, AccessType: 1, ModuleId: 1, RoleId: 1 });
    return otherHelper.sendResponse(res, httpStatus.OK, true, access, null, roleConfig.accessGet, null, 'Access Not Found');
  } catch (err) {
    next(err);
  }
};
roleController.SaveAccessList = async (req, res, next) => {
  try {
    const access = req.body;
    if (access._id) {
      const update = await accessSch.findByIdAndUpdate(access._id, { $set: access }, { new: true });
      return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, roleConfig.accessSave, null);
    } else {
      access.Added_by = req.user.id;
      const newModules = new accessSch(access);
      await newModules.save();
      return otherHelper.sendResponse(res, httpStatus.OK, true, newModules, null, roleConfig.accessSave, null);
    }
  } catch (err) {
    next(err);
  }
};
roleController.SaveAccessListFromRole = async (req, res, next) => {
  try {
    const roleid = req.params.roleid;
    const access = req.body.Access;
    if (access.length) {
      for (let i = 0; i < access.length; i++) {
        if (access[i]._id) {
          access[i].RoleId = roleid;
          await accessSch.findByIdAndUpdate(access[i]._id, { $set: access[i] }, { new: true });
        } else {
          access[i].RoleId = roleid;
          access[i].Added_by = req.user.id;
          const newAccess = new accessSch(access[i]);
          await newAccess.save();
        }
      }
      return otherHelper.sendResponse(res, httpStatus.NOT_MODIFIED, false, access, null, roleConfig.accessSave, null);
    } else {
      return otherHelper.sendResponse(res, httpStatus.NOT_MODIFIED, false, null, 'Nothing to save!!', 'Nothing to save!!', null);
    }
  } catch (err) {
    next(err);
  }
};
roleController.SaveAccessListForModule = async (req, res, next) => {
  try {
    const moduleid = req.params.moduleid;
    const access = req.body.Access;
    if (access.length) {
      for (let i = 0; i < access.length; i++) {
        if (access[i]._id) {
          access[i].ModuleId = moduleid;
          await accessSch.findByIdAndUpdate(access[i]._id, { $set: access[i] }, { new: true });
        } else {
          access[i].ModuleId = moduleid;
          access[i].Added_by = req.user.id;
          const newAccess = new accessSch(access[i]);
          await newAccess.save();
        }
      }
      return otherHelper.sendResponse(res, httpStatus.NOT_MODIFIED, false, access, null, roleConfig.accessSave, null);
    } else {
      return otherHelper.sendResponse(res, httpStatus.NOT_MODIFIED, false, null, 'Nothing to save!!', 'Nothing to save!!', null);
    }
  } catch (err) {
    next(err);
  }
};

roleController.GetAccessListForRole = async (req, res, next) => {
  try {
    const roleid = req.params.roleid;
    const AccessForRole = await accessSch.find({ RoleId: roleid }, { _id: 1, AccessType: 1, IsActive: 1, ModuleId: 1, RoleId: 1 });
    const ModulesForRole = await moduleSch.find({}, { _id: 1, ModuleName: 1, 'Path.AccessType': 1, 'Path._id': 1 });
    const Roles = await roleSch.find({}, { _id: 1, RolesTitle: 1, IsActive: 1 });
    return otherHelper.sendResponse(res, httpStatus.OK, true, { Access: AccessForRole, Module: ModulesForRole, Roles: Roles }, null, 'Access Get Success !!', null);
  } catch (err) {
    next(err);
  }
};
roleController.GetAccessListForModule = async (req, res, next) => {
  try {
    const moduleid = req.params.moduleid;
    const AccessForModule = await accessSch.find({ ModuleId: moduleid }, { _id: 1, AccessType: 1, IsActive: 1, ModuleId: 1, RoleId: 1 });
    const ModulesForRole = await moduleSch.findOne({ _id: moduleid }, { _id: 1, ModuleName: 1, 'Path.AccessType': 1, 'Path._id': 1 });
    const Roles = await roleSch.find({}, { _id: 1, RolesTitle: 1, IsActive: 1 });
    return otherHelper.sendResponse(res, httpStatus.OK, true, { Access: AccessForModule, Module: ModulesForRole, Roles: Roles }, null, roleConfig.accessGet, null);
  } catch (err) {
    next(err);
  }
};

module.exports = roleController;