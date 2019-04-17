using AutoMapper;
using Microsoft.Security.Application;
using Navigator.Contracts.Models;
using Navigator.Service.Models.DomainModels;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace Navigator.Service.Helpers
{
    /// <summary>
    /// mapper for kpi repository
    /// </summary>
    public class KPIDashboardMapper
    {
        /// <summary>
        /// Map kpi chart contract to database entity
        /// </summary>
        /// <param name="contract"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static KpiChart ChartContractToEntity(KpiChartContract contract)
        {
            var chart = Mapper.Map<KpiChartContract, KpiChart>(contract);

            return chart;
        }   
        
        /// <summary>
        /// Map database entity to kpi contract
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static KpiChartContract ChartEntityToContract(KpiChart entity)
        {
            return Mapper.Map<KpiChart, KpiChartContract>(entity);
        }
        public static KpiCategory CategoryContractToEntity(KpiCategoryContract contract)
        {
            return Mapper.Map<KpiCategoryContract, KpiCategory>(contract);
        }
        public static KpiCategoryContract CategoryEntityToContract(KpiCategory entity)
        {
            return Mapper.Map<KpiCategory, KpiCategoryContract>(entity);
        }

        public static KpiDataSet DataSetContractToEntity(KpiChartDataSetContract contract)
        {
            return Mapper.Map<KpiChartDataSetContract, KpiDataSet>(contract);
        }
        public static KpiAdditionalContent AdditionalContentContractToEntity(KpiAdditionalContentContract contract)
        {
            return Mapper.Map<KpiAdditionalContentContract, KpiAdditionalContent>(contract);
        }
    }
}