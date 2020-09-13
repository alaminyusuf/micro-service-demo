module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable('listings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
  })
}
