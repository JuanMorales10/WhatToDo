module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service',
        key: 'id'
      }
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cantidadPersonas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombreReserva: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    nombreUsuario: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'order',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, { foreignKey: 'usuario_dni', as: 'user' });
    Order.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    // Otras asociaciones si son necesarias
  };

  return Order;
};
