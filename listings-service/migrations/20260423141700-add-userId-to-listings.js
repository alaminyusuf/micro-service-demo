module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.addColumn('listings', 'userId', {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      key: 'id',
      model: 'users',
    },
  });
};
