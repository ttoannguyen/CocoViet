package com.cocoviet.backend.service.impl;

import com.cocoviet.backend.mapper.ProductVariantMapper;
import com.cocoviet.backend.models.dto.OrderDTO;
import com.cocoviet.backend.models.dto.ReceiptDetailDTO;
import com.cocoviet.backend.models.entity.*;
import com.cocoviet.backend.models.request.OrderRequest;
import com.cocoviet.backend.models.request.ReceiptDetailRequest;
import com.cocoviet.backend.repository.*;
import com.cocoviet.backend.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private IProducVariantRepository iProducVariantRepository;

    @Autowired
    private IStatusRepository iStatusRepository;

    @Autowired
    private ICustomerRepository iCustomerRepository;

    @Autowired
    private IRetailerRepository iretailerRepository;

    @Autowired
    private IOrderRepository iOrderRepository;

    @Autowired
    private IPaymentRepository iPaymentRepository;

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Autowired
    private IReceiptDetailRepository iReceiptDetailRepository;


    @Override
    public OrderDTO createOrder(OrderRequest orderRequest) {
        CustomerEntity customerEntity = iCustomerRepository.findByCustomerId(orderRequest.getCustomerId());
        StatusEntity statusEntity = iStatusRepository.findByStatusCode("CART");
        PaymentEntity paymentEntity = iPaymentRepository.findByPaymentCode("CASH");

        Set<ReceiptDetailEntity> newReceiptDetailEntity = new HashSet<>();

        OrderEntity orderEntity = iOrderRepository.findByCustomer_CustomerIdAndStatus_StatusCode(customerEntity.getCustomerId(), "CART");

        //gio hag da ton tai
        if(orderEntity == null){
            orderEntity = OrderEntity.builder()
                    .customer(customerEntity)
                    .status(statusEntity)
                    .payment(paymentEntity)
                    .receiptDetails(newReceiptDetailEntity)
                    .orderDate(LocalDateTime.now())
                    .build();

            iOrderRepository.save(orderEntity);

            for(ReceiptDetailRequest receiptDetailRequest : orderRequest.getReceiptDetailRequests()) {

                ProductVariantEntity productVariantEntity =iProducVariantRepository.findByVariantsId(receiptDetailRequest.getProductVariantId());
                if(productVariantEntity.getStock() == 0){
                    continue;
                }
                ReceiptDetailEntity receiptDetailEntity = ReceiptDetailEntity.builder()
                        .productOrder(orderEntity)
                        .productVariant(productVariantEntity)
                        .price(productVariantEntity.getPrice())
                        .quantity(receiptDetailRequest.getQuantity())
                        .build();

//                    productVariantEntity.setStock(productVariantEntity.getStock() - receiptDetailRequest.getQuantity());
                iProducVariantRepository.save(productVariantEntity);
                newReceiptDetailEntity.add(receiptDetailEntity);
            }
        }else{

            for(ReceiptDetailRequest receiptDetailRequest : orderRequest.getReceiptDetailRequests()) {

                ProductVariantEntity productVariantEntity =iProducVariantRepository.findByVariantsId(receiptDetailRequest.getProductVariantId());

                Optional<ReceiptDetailEntity> existRecieptDetailByVariants = iReceiptDetailRepository
                        .findByProductVariant_VariantsIdAndProductOrder_OrderId(receiptDetailRequest.getProductVariantId(),orderEntity.getOrderId());


                if(existRecieptDetailByVariants.isPresent()){
                    ReceiptDetailEntity existReceiptDetailEntity = existRecieptDetailByVariants.get();

                    //update quantity
                    existReceiptDetailEntity.setQuantity(receiptDetailRequest.getQuantity() + existReceiptDetailEntity.getQuantity());
                    newReceiptDetailEntity.add(existReceiptDetailEntity);
//                    productVariantEntity.setStock(productVariantEntity.getStock() - receiptDetailRequest.getQuantity());
                    iProducVariantRepository.save(productVariantEntity);

                }
                else{
                    ReceiptDetailEntity addRecieptDetail = ReceiptDetailEntity.builder()
                            .productOrder(orderEntity)
                            .productVariant(productVariantEntity)
                            .quantity(receiptDetailRequest.getQuantity())
                            .price(productVariantEntity.getPrice())
                            .build();

                    productVariantEntity.setStock(productVariantEntity.getStock() - receiptDetailRequest.getQuantity());
                    iProducVariantRepository.save(productVariantEntity);

                    newReceiptDetailEntity.add(addRecieptDetail);
                }
            }
        }
        iReceiptDetailRepository.saveAll(newReceiptDetailEntity);

        Set<ReceiptDetailDTO> receiptDetailDTOS = newReceiptDetailEntity.stream()
                .map(response -> ReceiptDetailDTO.builder()
                        .receiptDetailId(response.getReceiptDetailId())
                        .totalQuantity(response.getQuantity())
                        .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
                        .customerName(customerEntity.getCustomerName())
                        .customerNumber(customerEntity.getPhoneNumbers())
                        .customerAddress(customerEntity.getCustomerAddress())
                        .productName(response.getProductVariant().getProduct().getProductName())
                        .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
                        .build())
                .collect(Collectors.toSet());

        //updater
        orderEntity.setReceiptDetails(newReceiptDetailEntity);
        iOrderRepository.save(orderEntity);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(orderEntity.getOrderId());
        orderDTO.setOrderDate(orderEntity.getOrderDate());
        orderDTO.setStatusName(statusEntity.getStatusName());
        orderDTO.setReceiptDetails(receiptDetailDTOS);
        orderDTO.setPaymentMethod(paymentEntity.getPaymentMethod());

        return orderDTO;
    }

    @Override
    public OrderDTO updateOrder(String orderId, OrderRequest orderRequest) {

        OrderEntity orderEntity = iOrderRepository.findByOrderId(orderId);

        if(orderEntity == null){
            throw new RuntimeException("Order not found");
        }

        CustomerEntity customerEntity = iCustomerRepository.findByCustomerId(orderEntity.getCustomer().getCustomerId());

        Set<ReceiptDetailEntity> newReceiptDetailEntity = new HashSet<>();

        OrderDTO orderDTO = new OrderDTO();

        if(orderRequest.getReceiptDetailRequests() != null){
            for(ReceiptDetailRequest receiptDetailRequest : orderRequest.getReceiptDetailRequests()) {

                ProductVariantEntity productVariantEntity =iProducVariantRepository.findByVariantsId(receiptDetailRequest.getProductVariantId());

                Optional<ReceiptDetailEntity> existRecieptDetailByVariants = iReceiptDetailRepository
                        .findByProductVariant_VariantsIdAndProductOrder_OrderId(receiptDetailRequest.getProductVariantId(),orderEntity.getOrderId());

                if(existRecieptDetailByVariants.isPresent()){
                    ReceiptDetailEntity existReceiptDetailEntity = existRecieptDetailByVariants.get();

                    //update quantity
                    existReceiptDetailEntity.setQuantity(receiptDetailRequest.getQuantity() );
                    newReceiptDetailEntity.add(existReceiptDetailEntity);
                    //productVariantEntity.setStock(productVariantEntity.getStock() - receiptDetailRequest.getQuantity());
                    iProducVariantRepository.save(productVariantEntity);
                    newReceiptDetailEntity.add(existReceiptDetailEntity);
                }
            }

            iReceiptDetailRepository.saveAll(newReceiptDetailEntity);

            Set<ReceiptDetailDTO> receiptDetailDTOS = newReceiptDetailEntity.stream()
                    .map(response -> ReceiptDetailDTO.builder()
                            .receiptDetailId(response.getReceiptDetailId())
                            .totalQuantity(response.getQuantity())
                            .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
                            .customerName(customerEntity.getCustomerName())
                            .customerNumber(customerEntity.getPhoneNumbers())
                            .customerAddress(customerEntity.getCustomerAddress())
                            .productName(response.getProductVariant().getProduct().getProductName())
                            .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
                            .build())
                    .collect(Collectors.toSet());

            //updater
            orderEntity.setReceiptDetails(newReceiptDetailEntity);
            iOrderRepository.save(orderEntity);

            orderDTO.setReceiptDetails(receiptDetailDTOS);
        }else {
            Set<ReceiptDetailDTO> receiptDetailDTOS = orderEntity.getReceiptDetails().stream()
                    .map(response -> ReceiptDetailDTO.builder()
                            .receiptDetailId(response.getReceiptDetailId())
                            .totalQuantity(response.getQuantity())
                            .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
                            .customerName(customerEntity.getCustomerName())
                            .customerNumber(customerEntity.getPhoneNumbers())
                            .customerAddress(customerEntity.getCustomerAddress())
                            .productName(response.getProductVariant().getProduct().getProductName())
                            .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
                            .build())
                    .collect(Collectors.toSet());
            orderDTO.setReceiptDetails(receiptDetailDTOS);
        }

        if(orderRequest.getStatusCode() != null){
            StatusEntity statusEntity = iStatusRepository.findByStatusCode(orderRequest.getStatusCode());
            orderEntity.setStatus(statusEntity);
        }

        if(orderRequest.getPaymentCode() != null){
            PaymentEntity paymentEntity = iPaymentRepository.findByPaymentCode(orderRequest.getPaymentCode());
            orderEntity.setPayment(paymentEntity);
        }
        iOrderRepository.save(orderEntity);
        orderDTO.setOrderId(orderEntity.getOrderId());
        orderDTO.setOrderDate(orderEntity.getOrderDate());
        orderDTO.setStatusName(orderEntity.getStatus().getStatusName());
        orderDTO.setPaymentMethod(orderEntity.getPayment().getPaymentMethod());
        return orderDTO;
    }


    @Override
    public List<OrderDTO> getOrderByCustomerId(String customerId) {
        List<OrderEntity> listOrderEntities = iOrderRepository.findByCustomer_CustomerId(customerId);

        List<OrderDTO> orderDTOS = listOrderEntities.stream()
            .map(orderEntity -> {

                CustomerEntity customerEntity = iCustomerRepository.findByCustomerId(orderEntity.getCustomer().getCustomerId());
                Set<ReceiptDetailDTO> receiptDetailDTOS = orderEntity.getReceiptDetails().stream()
                    .map(response -> ReceiptDetailDTO.builder()
                        .receiptDetailId(response.getReceiptDetailId())
                        .totalQuantity(response.getQuantity())
                        .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
                        .customerName(customerEntity.getCustomerName())
                        .customerNumber(customerEntity.getPhoneNumbers())
                        .customerAddress(customerEntity.getCustomerAddress())
                        .productName(response.getProductVariant().getProduct().getProductName())
                        .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
                        .build())
                    .collect(Collectors.toSet());

                OrderDTO orderDTO = new OrderDTO();
                orderDTO.setOrderId(orderEntity.getOrderId());
                orderDTO.setOrderDate(orderEntity.getOrderDate());
                orderDTO.setStatusName(orderEntity.getStatus().getStatusName());
                orderDTO.setReceiptDetails(receiptDetailDTOS);
                orderDTO.setPaymentMethod(orderEntity.getPayment().getPaymentMethod());

                return orderDTO;
            }).collect(Collectors.toList());

        return orderDTOS;
//        Set<ReceiptDetailDTO> receiptDetailDTOS = orderEntity.getReceiptDetails().stream()
//                .map(response -> ReceiptDetailDTO.builder()
//                        .receiptDetailId(response.getReceiptDetailId())
//                        .totalQuantity(response.getQuantity())
//                        .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
//                        .customerName(customerEntity.getCustomerName())
//                        .customerNumber(customerEntity.getPhoneNumbers())
//                        .customerAddress(customerEntity.getCustomerAddress())
//                        .productName(response.getProductVariant().getProduct().getProductName())
//                        .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
//                        .build())
//                .collect(Collectors.toSet());
//
//
//        OrderDTO orderDTO = new OrderDTO();
//        orderDTO.setOrderId(orderEntity.getOrderId());
//        orderDTO.setOrderDate(orderEntity.getOrderDate());
//        orderDTO.setStatusName(orderEntity.getStatus().getStatusName());
//        orderDTO.setReceiptDetails(receiptDetailDTOS);
//        orderDTO.setPaymentMethod(orderEntity.getPayment().getPaymentMethod());
//
//        return orderDTO;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<OrderEntity> listOrderEntities = iOrderRepository.findAll();

        List<OrderDTO> orderDTOS = listOrderEntities.stream()
                .map(orderEntity -> {

                    CustomerEntity customerEntity = iCustomerRepository.findByCustomerId(orderEntity.getCustomer().getCustomerId());
                    Set<ReceiptDetailDTO> receiptDetailDTOS = orderEntity.getReceiptDetails().stream()
                        .map(response -> ReceiptDetailDTO.builder()
                            .receiptDetailId(response.getReceiptDetailId())
                            .totalQuantity(response.getQuantity())
                            .productVariants(productVariantMapper.toDTO(response.getProductVariant()))
                            .customerName(customerEntity.getCustomerName())
                            .customerNumber(customerEntity.getPhoneNumbers())
                            .customerAddress(customerEntity.getCustomerAddress())
                            .productName(response.getProductVariant().getProduct().getProductName())
                            .retailerName(iretailerRepository.findRetailerNameByProductId(response.getProductVariant().getProduct().getProductId()))
                            .build())
                        .collect(Collectors.toSet());

                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setOrderId(orderEntity.getOrderId());
                    orderDTO.setOrderDate(orderEntity.getOrderDate());
                    orderDTO.setStatusName(orderEntity.getStatus().getStatusName());
                    orderDTO.setReceiptDetails(receiptDetailDTOS);
                    orderDTO.setPaymentMethod(orderEntity.getPayment().getPaymentMethod());

                    return orderDTO;
                }).collect(Collectors.toList());

        return orderDTOS;
    }

}